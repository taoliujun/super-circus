import { Cascader, Form, Input } from 'antd-mobile';
import type { FunctionComponent } from 'react';
import { useMemo } from 'react';
import { useRequest } from 'ahooks';
import { RegionInterface } from 'taoliujun-shy-jobs-interface/lib/common/config';
import type { ApplyForm } from 'taoliujun-shy-jobs-interface/lib/model/applyForm';

interface Region {
  label: string;
  value: string;
  children?: Region[];
}

const District: FunctionComponent<{
  value?: string;
  onChange?: (input: string) => void;
  formFieldProps?: Record<string, any>;
}> = ({ value, onChange, formFieldProps = {} }) => {
  // 全国省市区
  const { data: options } = useRequest(async () => {
    const transformField = (list: Region[]) => {
      return list.map((v) => {
        const values = {
          ...v,
          value: v.label,
        };
        if (v.children) {
          values.children = transformField(v.children);
        }
        return values;
      });
    };

    const result = await RegionInterface({});
    return transformField(result);
  });

  const selectName = useMemo(() => {
    return value;
  }, [value]);

  return (
    <Cascader
      options={options || []}
      onConfirm={(values) => {
        let ret = '';
        if (values[0]) {
          ret += values[0];
        }
        if (values[1]) {
          ret += `-${values[1]}`;
        }
        if (values[2]) {
          ret += `-${values[2]}`;
        }
        onChange?.(ret);
      }}
    >
      {(_, actions) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Input value={selectName} placeholder={formFieldProps.placeholder} readOnly />
          <a style={{ whiteSpace: 'nowrap' }} onClick={actions.open}>
            选择
          </a>
        </div>
      )}
    </Cascader>
  );
};

/** 行政区 */
export const FormDistrict: FunctionComponent<{
  item: ApplyForm;
  formProps?: Record<string, any>;
  formFieldProps?: Record<string, any>;
}> = ({ item, formProps = {}, formFieldProps = {} }) => {
  return (
    <Form.Item label={item.label} name={item.name} {...formProps}>
      <District formFieldProps={formFieldProps} />
    </Form.Item>
  );
};
