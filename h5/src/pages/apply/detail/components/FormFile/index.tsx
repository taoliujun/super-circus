import { Form, ImageUploader } from 'antd-mobile';
import type { FunctionComponent } from 'react';
import { useMemo } from 'react';
import type { ApplyForm } from 'taoliujun-shy-jobs-interface/lib/model/applyForm';
import type { ImageUploadItem } from 'antd-mobile/es/components/image-uploader';
import { imageCompression } from '@/service/browser';

interface FileItem extends ImageUploadItem {
  file?: File;
}

const Upload: FunctionComponent<{
  value?: FileItem[];
  onChange?: (input: FileItem[]) => void;
  formFieldProps?: Record<string, any>;
}> = ({ value, onChange, formFieldProps = {} }) => {
  const files: FileItem[] = useMemo(() => {
    return (
      value?.map((v) => {
        return {
          ...v,
          key: v.key || Math.random(),
        };
      }) || []
    );
  }, [value]);

  return (
    <ImageUploader
      {...(formFieldProps.singleFile
        ? {
            maxCount: 1,
          }
        : {
            multiple: true,
            maxCount: 5,
          })}
      value={files}
      onChange={(values) => {
        onChange?.(values);
      }}
      upload={imageCompression}
    />
  );
};

/** 上传 */
export const FormFile: FunctionComponent<{
  item: ApplyForm;
  formProps?: Record<string, any>;
  formFieldProps?: Record<string, any>;
}> = ({ item, formProps = {}, formFieldProps = {} }) => {
  return (
    <Form.Item label={item.label} name={item.name} {...formProps}>
      <Upload formFieldProps={formFieldProps} />
    </Form.Item>
  );
};
