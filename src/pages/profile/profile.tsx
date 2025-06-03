import { Button, Input, Switch, Card, CardBody, Spinner } from '@nextui-org/react';
import axios from 'axios';
import { memo, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { FiSave, FiSettings } from 'react-icons/fi';

interface Settings {
  id: number;
  name: string;
  value: number | string | boolean;
  active: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const profilePageComponent = () => {
  const [flag, setFlag] = useState(false);
  const [settings, setSettings] = useState<Settings[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState<number[]>([]);

  useMemo(() => {
    setIsLoading(true);
    axios
      .get('/microservice/v1/payment/server/settings/list')
      .then(res => {
        setSettings(res.data.settingsList);
      })
      .catch(err => {
        toast.error(err.response?.data?.error || 'خطا در دریافت تنظیمات');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [flag]);

  const handleSettingToggle = (setting: Settings) => {
    setLoadingSettings(prev => [...prev, setting.id]);
    axios
      .put('/microservice/v1/payment/server/setting/active', {
        id: setting.id,
        active: !setting.active
      })
      .then(res => {
        toast.success(res.data.success);
        setFlag(!flag);
      })
      .catch(err => {
        toast.error(err.response.data.error);
      })
      .finally(() => {
        setLoadingSettings(prev => prev.filter(id => id !== setting.id));
      });
  };

  const handleSettingUpdate = (setting: Settings, newValue: string) => {
    setLoadingSettings(prev => [...prev, setting.id]);
    axios
      .put('/microservice/v1/payment/server/settings/update', {
        id: setting.id,
        value: newValue
      })
      .then(res => {
        toast.success(res.data.success);
        setFlag(!flag);
      })
      .catch(err => {
        toast.error(err.response.data.error);
      })
      .finally(() => {
        setLoadingSettings(prev => prev.filter(id => id !== setting.id));
      });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div dir="rtl" className="mb-6 flex items-center gap-3">
        <FiSettings size={24} className="light:text-slate-700 dark:text-slate-300" />
        <h1 className="text-2xl font-bold light:text-slate-900 dark:text-slate-100">تنظیمات سیستم</h1>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner size="lg" color="primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {settings?.map(setting => (
            <Card
              key={setting.id}
              className={`h-full transition-all duration-300 ${
                setting.active ? 'dark:hover:bg-slate-750 light:bg-white light:shadow-md light:hover:shadow-lg dark:bg-slate-800' : 'light:bg-slate-100 dark:bg-slate-900/50'
              }`}
              isPressable={false}
            >
              <CardBody className="p-5">
                <div className="flex h-full flex-col">
                  <h2 className={` ${setting.active ? 'light:text-slate-900 dark:text-slate-100' : 'light:text-slate-500 dark:text-slate-400'} mb-4 text-xl font-bold transition-colors`}>
                    {setting.description}
                  </h2>

                  <div className="mt-auto flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <Switch
                        isDisabled={loadingSettings.includes(setting.id)}
                        isSelected={setting.active}
                        onValueChange={() => handleSettingToggle(setting)}
                        color="primary"
                        size="lg"
                        classNames={{
                          wrapper: setting.active ? 'light:bg-primary-500 dark:bg-primary-500' : 'light:bg-slate-300 dark:bg-slate-600',
                          thumb: 'light:bg-white dark:bg-white'
                        }}
                      >
                        <span className={` ${setting.active ? 'light:text-slate-900 dark:text-slate-100' : 'light:text-slate-500 dark:text-slate-400'} text-sm font-medium transition-colors`}>
                          {setting.active ? 'فعال' : 'غیر فعال'}
                        </span>
                      </Switch>
                    </div>

                    {(typeof setting.value === 'number' || typeof setting.value === 'string') && (
                      <div className="flex flex-col gap-2">
                        <Input
                          label="مقدار"
                          placeholder="مقدار را وارد کنید"
                          value={String(setting.value)}
                          onValueChange={value => {
                            setSettings(prev => {
                              return prev?.map(item => {
                                if (item.id === setting.id) {
                                  return {
                                    ...item,
                                    value: value
                                  };
                                }
                                return item;
                              });
                            });
                          }}
                          variant="bordered"
                          classNames={{
                            label: 'light:text-slate-700 dark:text-slate-300',
                            input: 'light:text-slate-900 dark:text-slate-100',
                            inputWrapper: 'light:bg-white dark:bg-slate-800 light:border-slate-300 dark:border-slate-600'
                          }}
                          isDisabled={loadingSettings.includes(setting.id)}
                        />
                        <Button
                          isDisabled={loadingSettings.includes(setting.id)}
                          className="mt-1"
                          color="primary"
                          variant="shadow"
                          startContent={loadingSettings.includes(setting.id) ? <Spinner size="sm" color="white" /> : <FiSave />}
                          onPress={() => handleSettingUpdate(setting, String(setting.value))}
                        >
                          ذخیره تغییرات
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export const Profile = memo(profilePageComponent);
