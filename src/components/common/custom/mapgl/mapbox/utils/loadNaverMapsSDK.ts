import { isBrowser } from "./isBrowser";

const NAVER_MAP_SDK_URL = "https://oapi.map.naver.com/openapi/v3/maps.js";

interface LoadSDKOptions {
  clientId: string;
  submodules?: string[];
  timeout?: number;
}

export const isNaverMapsLoaded = (): boolean => {
  if (!isBrowser()) return false;
  return !!(window as any).naver?.maps;
};

export const isNaverMapsGLLoaded = (): boolean => {
  if (!isBrowser()) return false;
  return !!(window as any).naver?.maps?.glEnabled;
};

const waitForGLSubmodule = (timeout: number = 10000): Promise<void> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      if (isNaverMapsGLLoaded()) resolve();
      else if (Date.now() - startTime > timeout)
        reject(new Error("Timeout: Failed to load Naver Maps GL submodule"));
      else setTimeout(check, 50);
    };
    check();
  });
};

export const loadNaverMapsSDK = async ({
  clientId,
  submodules = ["gl"],
  timeout = 10000,
}: LoadSDKOptions): Promise<void> => {
  if (!isBrowser()) {
    throw new Error(
      "loadNaverMapsSDK can only be called in browser environment"
    );
  }

  const needsGL = submodules.includes("gl");
  if (needsGL && isNaverMapsGLLoaded()) return;
  if (!needsGL && isNaverMapsLoaded()) return;

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const submodulesParam =
      submodules.length > 0 ? `&submodules=${submodules.join(",")}` : "";
    script.src = `${NAVER_MAP_SDK_URL}?ncpKeyId=${clientId}${submodulesParam}`;
    script.async = true;

    script.onload = async () => {
      try {
        if (needsGL) await waitForGLSubmodule(timeout);
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    script.onerror = () => reject(new Error("Failed to load Naver Maps SDK"));
    document.head.appendChild(script);
  });
};
