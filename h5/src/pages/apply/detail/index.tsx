import { Button, Form } from 'antd-mobile';
import type { FunctionComponent } from 'react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequest } from 'ahooks';
import { PersonCreateInterface } from 'taoliujun-shy-jobs-interface/lib/h5/person';
import { ApplyDetailInterface } from 'taoliujun-shy-jobs-interface/lib/h5/apply';
import { UploadInterface } from 'taoliujun-shy-jobs-interface/lib/common/file';
import type { InterfaceRequest } from 'taoliujun-shy-jobs-interface/lib/request';
import { ApplyFormSourceEnum } from 'taoliujun-shy-jobs-interface/lib/model/applyForm';
import { getRoute, WebRouteNameEnum } from '@/service/webRoute';
import { toastInfo, toastSuccess } from '@/service/toast';
import { useSetTitle } from '@/hooks/useSetTitle';
import { useQuery } from '@/hooks/useQuery';
import { ApplyDetail } from '@/components/ApplyDetail';
import { Forms } from './components/Forms';
import styles from './styles.module.less';

type DataRequest = InterfaceRequest<typeof PersonCreateInterface>;

/** 报名 */
export const Detail: FunctionComponent = () => {
  const [form] = Form.useForm<DataRequest>();

  const go = useNavigate();

  const id = Number(useQuery('id'));

  // 请求报名控件详情
  const { data } = useRequest(() => ApplyDetailInterface({ id }));

  useSetTitle(`${data?.title || ''} - 报名`);

  const forms = useMemo(() => {
    const systemForms =
      data?.form.filter((item) => item.source === ApplyFormSourceEnum.SYSTEM) || [];
    const otherForms =
      data?.form.filter((item) => item.source !== ApplyFormSourceEnum.SYSTEM) || [];

    return [...systemForms, ...otherForms];
  }, [data?.form]);

  // 报名提交
  const { loading, runAsync } = useRequest(
    async ({ truename, mobile, idcard, ...rest }) => {
      const record = await Promise.all(
        Object.entries(rest).map(async ([index, item]) => {
          if (Array.isArray(item)) {
            const result = await Promise.all(
              item.map((v) => {
                if (v.file) {
                  return UploadInterface({ file: v.file, name: v.file.name });
                }
                return v.url;
              }),
            );

            return {
              label: index,
              value: result
                .map((v) => {
                  return v.url;
                })
                .join(`\n`) as string,
            };
          }
          return {
            label: index,
            value: item as string,
          };
        }),
      );

      await PersonCreateInterface({
        truename,
        mobile,
        idcard,
        applyId: data?.id as number,
        record,
      });

      await toastSuccess('报名成功');

      go(
        getRoute({
          name: WebRouteNameEnum.PERSON_LIST,
        }),
        {
          replace: true,
        },
      );
      return true;
    },
    { manual: true },
  );

  return (
    <>
      <ApplyDetail data={data} />
      <p className={styles.infoTitle}>填写你的报名信息</p>
      <Form
        form={form}
        footer={
          <Button color="primary" type="submit" size="large" block loading={loading}>
            报&nbsp;名
          </Button>
        }
        onFinish={(values) => {
          return runAsync(values);
        }}
        onFinishFailed={({ errorFields }) => {
          toastInfo(errorFields?.[0]?.errors?.[0]);
        }}
      >
        {forms.map((v, k) => {
          return <Forms key={k} item={v} />;
        })}
      </Form>
    </>
  );
};
