/**
 * 路径和参数转成url
 */
const stringifyPathAndParams = (name: string, params: Record<string, string>): string => {
  // path
  let path = name;
  if (name?.startsWith('http://') || name?.startsWith('https://')) {
    //
  } else if (name?.startsWith('/')) {
    //
  } else {
    path = `/${path}`;
  }

  // 连字符
  const hyphen = path?.includes('?') ? '&' : '?';

  const u = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    u.set(key, value);
  });
  // 参数
  const query = u.toString();

  let url = path;

  if (query) {
    url = `${url}${hyphen}${query}`;
  }

  return url;
};

/**
 * 解析项目内URL
 */
export const getRoute = (route: WebRoute): string => {
  const { name, params = {} } = route;

  return stringifyPathAndParams(name, params as Record<string, string>);
};

/**
 * 解析路由的完整链接
 */
export const getAbsoluteRoute = (route: WebRoute | string): string => {
  const { origin } = window.location;
  if ((route as WebRoute)?.name) {
    return `${origin}${getRoute(route as WebRoute)}`;
  }
  return `${window.location.origin}${route as string}`;
};

/**
 * h5路由
 * 注意：添加新路由后，务必添加参数类型到WebRoute中
 */
export enum WebRouteNameEnum {
  /** index */
  HOME = '/',

  /** 登录 */
  USER_LOGIN = '/user/login',

  /** 报名列表 */
  PERSON_LIST = '/person/list',

  /** 报名详情 */
  PERSON_DETAIL = '/person/detail/',
}

interface WebRouteParams {
  //
  nothing?: string;
}

type WebRoute =
  | {
      name: WebRouteNameEnum.USER_LOGIN;
      params?: {
        redirect: string;
      } & WebRouteParams;
    }
  | {
      name: WebRouteNameEnum.PERSON_DETAIL;
      params: {
        id: string;
      } & WebRouteParams;
    }
  | {
      name: WebRouteNameEnum;
      params?: WebRouteParams;
    };
