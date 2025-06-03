import { Autocomplete, AutocompleteItem } from '@nextui-org/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import EditNetwork from '../../components/networks/EditNetwork';
import AddInternal from '../../components/networks/AddInternal';
import AddExternal from '../../components/networks/AddExternal';
import DeleteNode from '../../components/networks/DeleteNode';
import Graph from '../../components/networks/Graph';

interface Node {
  id: number;
  name: string;
  type: string;
  subType: 'organization' | 'store' | 'connection';
  createdAt: string;
  updatedAt: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface Link {
  id: number;
  parentNetwork: number;
  childNetwork: number;
  createdAt: string;
  updatedAt: string;
  parentNetworkName: string;
  childNetworkName: string;
  source: number | Node;
  target: number | Node;
  value?: number;
}

const NetworksPage = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [key, setKey] = useState(0); // Add a key state to force re-render
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>();

  const [internals, setInternals] = useState<Node[]>([]);
  const [externals, setExternals] = useState<Node[]>([]);

  const [selectedInternalId, setSelectedInternalId] = useState<number | null>();
  const [selectedExternalId, setSelectedExternalId] = useState<number | null>();
  const [areNodesConnected, setAreNodesConnected] = useState(false);

  const [flag, setFlag] = useState(false);

  // Listen for theme changes by observing DOM class changes
  useEffect(() => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          const newTheme = isDark ? 'dark' : 'light';

          if (newTheme !== currentTheme) {
            setCurrentTheme(newTheme);
            setKey(prevKey => prevKey + 1); // Force Graph re-render
          }
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, [currentTheme]);

  useMemo(() => {
    axios
      .get('/microservice/v1/payment/server/netconn/list')
      .then(res => {
        const updatedLinks = res.data.netConn
          ? res.data.netConn.map((link: Link) => ({
              ...link,
              source: Number(link.parentNetwork),
              target: Number(link.childNetwork)
            }))
          : [];
        setLinks(updatedLinks);
      })
      .catch(err => {
        toast.error(err.response.data.error);
      });

    axios
      .get('/microservice/v1/payment/server/network/list')
      .then(res => {
        if (res.data.networks && res.data.networks.length > 0) {
          setNodes(res.data.networks);
          setInternals(res.data.networks);
          setExternals(res.data.networks.filter((node: Node) => node.type === 'external'));
        } else {
          setNodes([]);
          setInternals([]);
          setExternals([]);
        }
      })
      .catch(err => {
        toast.error(err.response.data.error);
      });
  }, [flag]);

  const handleLinkClick = () => {
    axios
      .post('/microservice/v1/payment/server/netconn/create', {
        parentNetworkId: selectedExternalId,
        childNetworkId: selectedInternalId
      })
      .then(res => {
        toast.success(res.data.success);
        setAreNodesConnected(true);
        setTimeout(() => {
          setFlag(!flag);
        }, 1500);
        setTimeout(() => {
          setAreNodesConnected(false);
          setSelectedExternalId(null);
          setSelectedInternalId(null);
        }, 3000);
      })
      .catch(err => {
        toast.error(err.response.data.error);
      });
  };

  const handleLinkDelete = () => {
    axios.get('/microservice/v1/payment/server/netconn/list').then(res => {
      const netConns = res.data.netConn;

      netConns.forEach((netConn: Link) => {
        if (netConn.parentNetwork == selectedExternalId && netConn.childNetwork == selectedInternalId) {
          axios
            .delete('/microservice/v1/payment/server/netconn/delete', {
              data: {
                netConnId: netConn.id
              }
            })
            .then(res => {
              toast.success(res.data.success);
              // Update the links state to remove the deleted link
              setLinks(links.filter(link => link.id !== netConn.id));
              setFlag(!flag);
            })
            .catch(err => {
              toast.error(err.response.data.error);
            });
        } else {
          // TODO what the hell is this amir ?
          toast.error('Link not found');
        }
      });
    });
  };

  console.log('flag', flag);

  return (
    <div className="relative">
      <section className="fixed right-4 top-4 flex flex-col gap-4 md:right-[13%] md:top-24 xl:right-[11%] 2xl:right-[10%]">
        <EditNetwork setFlag={setFlag} flag={flag} _nodes={nodes} />
        <AddInternal setFlag={setFlag} flag={flag} />
        <AddExternal setFlag={setFlag} flag={flag} />
        <DeleteNode setFlag={setFlag} flag={flag} />
      </section>

      <section className="hidden h-16 items-center bg-gradient-to-t p-6 light:from-neutral-200 light:to-neutral-300 dark:from-neutral-800 dark:to-neutral-700 md:flex">
        <Autocomplete
          isDisabled={areNodesConnected}
          color={areNodesConnected ? 'success' : 'primary'}
          label="شبکه اتصال"
          className="mx-4 basis-3/12 md:mx-10"
          aria-label="externals"
          selectedKey={selectedExternalId} //@ts-ignore
          onSelectionChange={setSelectedExternalId}
          defaultItems={externals}
        >
          {internal => (
            <AutocompleteItem key={internal.id} value={internal.name}>
              {internal.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <div className="grid h-16 basis-1/2 grid-cols-2 gap-x-10 p-0.5 md:p-2">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            exit={{ opacity: 0 }}
            style={{
              width: areNodesConnected ? '25%' : '100%',
              placeSelf: areNodesConnected ? 'center' : 'end',
              justifySelf: areNodesConnected ? 'center' : 'end',
              gridColumn: areNodesConnected ? 'span 2 / span 2' : 'auto'
            }}
            className={`p-3.5 px-6 text-white transition-all focus:outline-none focus:ring-0 active:scale-95 ${areNodesConnected ? 'col-span-2 w-1/4 place-self-center justify-self-center rounded-2xl bg-green-500' : 'rounded-lg bg-blue-500 hover:bg-blue-400'}`}
            onClick={handleLinkClick}
          >
            اتصال
          </motion.button>
          {!areNodesConnected && (
            <motion.button
              className="rounded-lg bg-danger-500 p-3.5 px-6 text-white transition-all hover:bg-danger-400 focus:outline-none focus:ring-0 active:scale-95"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onClick={handleLinkDelete}
            >
              قطع اتصال
            </motion.button>
          )}
          <motion.svg className="col-span-2 h-2 text-green-300" width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            {areNodesConnected && (
              <motion.path
                style={{ originX: '50%', originY: '50%' }}
                initial={{ pathLength: 0 }}
                animate={areNodesConnected ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
                d="M0 50 H100" // This draws a horizontal line from (0, 50) to (100, 50)
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="rgb(50, 205, 50)" // Lighter green color
                filter="url(#greenShadow)" // Applying the shadow filter
              />
            )}
          </motion.svg>
        </div>

        <Autocomplete
          isDisabled={areNodesConnected}
          color={areNodesConnected ? 'success' : 'primary'}
          label="انتخاب شبکه"
          className="mx-4 basis-3/12 md:mx-10"
          aria-label="internals"
          selectedKey={selectedInternalId} //@ts-ignore
          onSelectionChange={setSelectedInternalId}
          defaultItems={internals}
        >
          {internal => (
            <AutocompleteItem key={internal.id} value={internal.name}>
              {internal.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
      </section>
      <section className="light:bg-neutral-400 dark:bg-neutral-800">
        {nodes && nodes.length > 0 ? <Graph key={key} data={{ nodes, links }} /> : <div className="mx-auto h-[80vh] w-full text-center text-2xl font-bold">اطلاعاتی برای نمایش وجود ندارد!</div>}
      </section>
    </div>
  );
};

export default NetworksPage;
