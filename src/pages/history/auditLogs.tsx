import AuditLogsMoreInfo from '../../components/history/AuditLogsMoreInfo';
import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import axios from 'axios';
import { memo, useEffect, useState } from 'react';

const tableHeaders = ['ردیف', 'کاربر', 'عملیات', 'اطلاعات بیشتر', 'تاریخ ساخت', 'تاریخ آپدیت'];

interface AuditLogsResponse {
  id: number;
  adminId: string;
  action: string;
  resource: any;
  resourceAfter?: any;
  createdAt: string;
  updatedAt: string;
}

const auditLogsComponent = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    axios
      .get('/microservice/v1/payment/server/audit/list')
      .then(res => {
        setAuditLogs(res.data.auditLogs?.reverse());
      })
      .catch(err => {
        console.log(err);
      });

    axios
      .get('/microservice/v1/payment/server/admin/list')
      .then(res => {
        setAdmins(res.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div dir="rtl" className="md:p-4 sm:p-1 p-px w-[90vw] 2xl:w-[93vw] mx-auto">
      <Table
        aria-label="Audit logs"
        dir="ltr"
        className="mt-4 *:text-white"
        classNames={{
          wrapper: 'bg-slate-800',
          th: 'bg-slate-700'
        }}
      >
        <TableHeader>
          {tableHeaders.map((header, index) => (
            <TableColumn key={index} className="text-center text-amber-100 text-lg">
              {header}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent={<Spinner color="primary" size="lg" />}>
          {auditLogs?.map((log: AuditLogsResponse, index: number) => {
            const createdAt = new Date(log.createdAt)
              .toLocaleString('fa-IR', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              })
              .toString();
            const updatedAt = new Date(log.updatedAt)
              .toLocaleDateString('fa-IR', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              })
              .toString();

            const admin: any = admins.find((admin: any) => admin.id === Number(log.adminId));

            return (
              <TableRow>
                <TableCell className="text-center font-mono">{index + 1}</TableCell>
                <TableCell className="text-center text-lg">{admin?.username}</TableCell>
                <TableCell className="text-center text-lg">{log.action}</TableCell>
                <TableCell className="text-center flex justify-center items-center cursor-pointer">
                  <AuditLogsMoreInfo resource={log.resource} resourceAfter={log.resourceAfter} />
                </TableCell>
                <TableCell className="text-center">{createdAt}</TableCell>
                <TableCell className="text-center">{updatedAt}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export const History = memo(auditLogsComponent);
