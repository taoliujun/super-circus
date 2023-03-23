import type { Form } from 'antd-mobile';
import type { ComponentProps, FunctionComponent } from 'react';
import { useMemo } from 'react';
import type { ApplyForm } from 'taoliujun-shy-jobs-interface/lib/model/applyForm';
import { ApplyFormTypeEnum } from 'taoliujun-shy-jobs-interface/lib/model/applyForm';
import { isMobilePhone, isIdentityCard } from 'class-validator';
import { FormText } from '../FormText';
import { FormTextarea } from '../FormTextarea';
import { FormDistrict } from '../FormDistrict';
import { FormSelect } from '../FormSelect';
import { FormFile } from '../FormFile';

/** 报名控件 */
export const Forms: FunctionComponent<{ item: ApplyForm }> = ({ item }) => {
  const { placeholder, required, maxLength } = item;

  const formProps = useMemo(() => {
    const rules: ComponentProps<typeof Form['Item']>['rules'] = [
      {
        required: required === 1,
        validator: (rule, value) => {
          const field = (rule as any).field as string;

          if (rule.required && !value) {
            return Promise.reject(new Error(`请输入$\{label}`));
          }

          if (field === 'mobile' && !isMobilePhone(value, 'zh-CN')) {
            return Promise.reject(new Error('请输入正确的手机号'));
          }
          if (field === 'idcard' && !isIdentityCard(value, 'zh-CN')) {
            return Promise.reject(new Error('请输入正确的身份证'));
          }

          return Promise.resolve();
        },
      },
    ];

    return {
      rules,
    };
  }, [required]);

  const formFieldProps = {
    placeholder,
    maxLength,
    singleFile: item.type === ApplyFormTypeEnum.FILE && item.name === '报名照片',
  };

  if (item.type === ApplyFormTypeEnum.TEXT) {
    return <FormText item={item} formProps={formProps} formFieldProps={formFieldProps} />;
  }

  if (item.type === ApplyFormTypeEnum.TEXTAREA) {
    return <FormTextarea item={item} formProps={formProps} formFieldProps={formFieldProps} />;
  }

  if (item.type === ApplyFormTypeEnum.DISTRICT) {
    return <FormDistrict item={item} formProps={formProps} formFieldProps={formFieldProps} />;
  }

  if (item.type === ApplyFormTypeEnum.SELECT) {
    return <FormSelect item={item} formProps={formProps} formFieldProps={formFieldProps} />;
  }

  if (item.type === ApplyFormTypeEnum.FILE) {
    return <FormFile item={item} formProps={formProps} formFieldProps={formFieldProps} />;
  }

  return null;
};
