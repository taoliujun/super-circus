import {
  Button,
  Image as AntdImage,
  ImageViewer,
  List,
  Space,
  AutoCenter,
  Modal,
} from 'antd-mobile';
import type { ContextType, FunctionComponent } from 'react';
import { useRef, useMemo, createContext, useContext, useEffect, useState } from 'react';
import { useRequest } from 'ahooks';
import {
  PersonDetailInterface,
  PersonPayInterface,
} from 'taoliujun-shy-jobs-interface/lib/h5/person';
import qrc from 'qrcode';
import JSBarcode from 'jsbarcode';
import dayjs from 'dayjs';
import { PersonStatusEnum } from 'taoliujun-shy-jobs-interface/lib/model/person';
import { fenToYuan } from '@taoliujun/utils';
import type { InterfaceReply } from 'taoliujun-shy-jobs-interface/lib/request';
import classNames from 'classnames';
import html2canvas from 'html2canvas';
import imageFace from '../../../assets/img/face.png';
import { useSetTitle } from '@/hooks/useSetTitle';
import { useQuery } from '@/hooks/useQuery';
import { ApplyDetail } from '@/components/ApplyDetail';
import { wechatConfig } from '@/service/wechat';
import { getApiUrl } from '@/service/request';
import { GlobalStoreContext } from '@/components/GlobalStore';
import { SpaceHeight } from '@/components/SpaceHeight';
import { delay } from '@/service/utils';
import styles from './styles.module.less';

const StoreContext = createContext(
  {} as {
    detail: InterfaceReply<typeof PersonDetailInterface>;
    applyInfo: InterfaceReply<typeof PersonDetailInterface>['relationApply'];
  },
);

type StoreContextType = ContextType<typeof StoreContext>;

// 微信支付
const WechatPay: FunctionComponent = () => {
  const { detail } = useContext(StoreContext);

  const { runAsync: onPay, loading: payLoading } = useRequest(
    async () => {
      const l = window.location;
      if (!l.pathname.endsWith('/')) {
        window.location.replace(`${l.origin}${l.pathname}/${l.search}`);
        return;
      }

      const res = await PersonPayInterface({
        id: detail?.id as number,
        notify_url: `${window.location.origin}${getApiUrl('person/h5/wechatNotify')}`,
      });
      window.wx.chooseWXPay({
        ...res.payInfo,
        success: (ret: any) => {
          // 支付成功后的回调函数
          console.log('==支付成功==', ret);
          Modal.alert({
            content: '支付成功',
            onConfirm: () => {
              window.location.reload();
            },
          });
        },
      });
    },
    { manual: true },
  );

  return (
    <>
      {Boolean(detail?.controlAble?.pay) && (
        <div className={styles.payWrapper}>
          <Button color="primary" block loading={payLoading} onClick={onPay}>
            微信支付
          </Button>
        </div>
      )}
    </>
  );
};

// 准考证图
const ExamInfoPrint: FunctionComponent = () => {
  const {
    detail: { ticket, examInfo, record, idcard, truename },
    applyInfo,
  } = useContext(StoreContext);

  // 显示准考证信息？
  const showExam = useMemo(() => {
    return Boolean(examInfo?.examRoom);
  }, [examInfo?.examRoom]);

  // 头像
  const face = useMemo(() => {
    return record?.find((v) => v.label === '报名照片')?.value || imageFace;
  }, [record]);

  // 性别
  const sex = useMemo(() => {
    return record?.find((v) => v.label === '性别')?.value || '';
  }, [record]);

  // 二维码
  const [qrImg, setQrImg] = useState('');
  useEffect(() => {
    if (ticket) {
      qrc.toDataURL(ticket, { margin: 0, width: 600 }).then((res) => {
        setQrImg(res);
      });
    }
  }, [ticket]);

  // 条码
  const barRef = useRef(null as unknown as HTMLCanvasElement);
  useEffect(() => {
    if (ticket) {
      window.requestAnimationFrame(() => {
        if (!barRef.current) {
          return;
        }
        JSBarcode(barRef.current, ticket, {
          format: 'CODE128',
          margin: 0,
          height: 60,
          textMargin: 0,
        });
      });
    }
  }, [ticket]);

  // 准考证图
  const examRef = useRef(null as unknown as HTMLDivElement);
  useEffect(() => {
    if (!ticket) {
      return;
    }
    window.requestAnimationFrame(async () => {
      await delay(3000);
      const c = examRef.current;
      if (!c) {
        return;
      }
      html2canvas(c).then((res) => {
        const img = document.createElement('img');
        img.classList.add(styles.examWrapperCanvas);
        img.setAttribute('src', res.toDataURL('image/jpeg'));
        c.after(img);
        c.remove();
      });
    });
  }, [ticket]);

  if (!ticket) {
    return null;
  }

  return (
    <>
      <p className={styles.infoTitle}>准考证</p>
      <SpaceHeight height={40} />
      <div ref={examRef} className={styles.examWrapper}>
        <p className={styles.title}>{applyInfo.title}&nbsp;准考证</p>
        <div className={styles.p1}>
          <AntdImage className={styles.face} src={face} alt="头像" />
          <div className={styles.p1_1}>
            <p className={classNames(styles.item, styles.itemSmall)}>
              <span className={styles.label}>姓名</span>
              <span className={styles.value}>{truename}</span>
            </p>
            {showExam && (
              <p className={classNames(styles.item, styles.itemSmall)}>
                <span className={styles.label}>考场</span>
                <span className={styles.value}>
                  考场{examInfo?.examRoom}，座位{examInfo?.examSit}
                </span>
              </p>
            )}
            {showExam && Boolean(sex) && (
              <p className={classNames(styles.item, styles.itemSmall)}>
                <span className={styles.label}>性别</span>
                <span className={styles.value}>{sex}</span>
              </p>
            )}
            <p className={classNames(styles.item, styles.itemSmall)}>
              <span className={styles.label}>证号</span>
              <span className={styles.value}>{idcard}</span>
            </p>
          </div>
        </div>
        {showExam && (
          <>
            {Boolean(applyInfo.examInfo?.examTime) && (
              <p className={styles.item}>
                <span className={styles.label}>考试时间</span>
                <span className={styles.value}>{applyInfo.examInfo?.examTime}</span>
              </p>
            )}
            {Boolean(applyInfo.examInfo?.examAddress) && (
              <p className={styles.item}>
                <span className={styles.label}>考试地点</span>
                <span className={styles.value}>{applyInfo.examInfo?.examAddress}</span>
              </p>
            )}
            {Boolean(applyInfo.examInfo?.examContent) && (
              <p className={styles.item}>
                <span className={styles.label}>考试内容</span>
                <span className={styles.value}>{applyInfo.examInfo?.examContent}</span>
              </p>
            )}
            {Boolean(applyInfo.examInfo?.examNotice) && (
              <p className={styles.item}>
                <span className={styles.label}>考试须知</span>
                <span className={styles.value}>{applyInfo.examInfo?.examNotice}</span>
              </p>
            )}
          </>
        )}
        <AutoCenter className={styles.ticket}>准考证号&nbsp;&nbsp;{ticket}</AutoCenter>
        <SpaceHeight height={40} />
        <AutoCenter>
          {Boolean(qrImg) && <AntdImage className={styles.qrImg} src={qrImg} />}
        </AutoCenter>
        <SpaceHeight height={40} />
        <AutoCenter>
          <canvas ref={barRef} />
        </AutoCenter>
      </div>
      <SpaceHeight height={40} />
      <AutoCenter>
        <span>如何下载：长按上面的准考证图片，选择“保存到手机”</span>
      </AutoCenter>
      <SpaceHeight height={40} />
    </>
  );
};

// 主体
const Main: FunctionComponent = () => {
  const { globalEnums } = useContext(GlobalStoreContext);
  const { detail, applyInfo } = useContext(StoreContext);

  const [image, setImage] = useState('');

  // 返回控件
  const handleRenderFormItem = (item: { label: string; value: string }, index: number) => {
    return (
      <List.Item
        key={item.label + index}
        extra={
          item.value?.startsWith('/upload') ? (
            <Space>
              {item.value.split(`\n`).map((v, k) => {
                return (
                  <AntdImage
                    key={k}
                    src={v}
                    height={60}
                    width={60}
                    fit="cover"
                    lazy
                    onClick={() => {
                      setImage(v);
                    }}
                  />
                );
              })}
            </Space>
          ) : (
            item.value?.split(`\n`).map((v, k) => {
              return <div key={k}>{v}</div>;
            })
          )
        }
      >
        {item.label}
      </List.Item>
    );
  };

  useEffect(() => {
    wechatConfig(['chooseWXPay'], window.location.href.replace(window.location.hash, ''));
  }, []);

  return (
    <>
      <ApplyDetail data={applyInfo} />
      <p className={styles.infoTitle}>你的报名信息</p>
      <List>
        <List.Item extra={dayjs(detail?.createTime).format('YYYY-MM-DD HH:mm')}>报名时间</List.Item>
        <List.Item extra={detail?.truename}>姓名</List.Item>
        <List.Item extra={detail?.mobile}>手机号</List.Item>
        <List.Item extra={detail?.idcard}>身份证</List.Item>
        {detail?.record?.map(handleRenderFormItem)}
        {Boolean(detail?.fee) && (
          <List.Item extra={<>{fenToYuan(detail?.fee)}元</>}>报名费用</List.Item>
        )}
        <List.Item extra={globalEnums.personStatus?.[detail?.status || '']}>状态</List.Item>
        {detail?.status === PersonStatusEnum.REJECTED && Boolean(detail?.rejectReason) && (
          <List.Item extra={detail?.rejectReason}>拒绝原因</List.Item>
        )}
        {Boolean(detail?.fee) && (
          <List.Item extra={globalEnums.personPayStatus?.[detail?.payStatus || '']}>
            支付状态
          </List.Item>
        )}
        {Boolean(detail?.payOrder) && <List.Item extra={detail?.payOrder}>支付单号</List.Item>}
      </List>
      <ImageViewer
        image={image}
        visible={Boolean(image)}
        onClose={() => {
          setImage('');
        }}
      />
      <ExamInfoPrint />
      <WechatPay />
    </>
  );
};

/** 详情 */
export const Detail: FunctionComponent = () => {
  useSetTitle('报名详情');

  const id = useQuery('id');

  // 报名信息
  const { data: detail = {} as StoreContextType['detail'] } = useRequest(async () => {
    const res = await PersonDetailInterface({ id: Number(id) });
    return res;
  });

  const applyInfo = useMemo(() => {
    return detail?.relationApply || {};
  }, [detail?.relationApply]);

  useEffect(() => {
    wechatConfig(['chooseWXPay'], window.location.href.replace(window.location.hash, ''));
  }, []);

  return (
    <StoreContext.Provider value={{ detail, applyInfo }}>
      <Main />
    </StoreContext.Provider>
  );
};
