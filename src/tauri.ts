import { invoke } from "@tauri-apps/api/tauri";

const generate = async (): Promise<string> => {
  return await invoke("generate", {});
};

interface Response<T> {
  success: boolean;
  result: T;
  message: string;
}

const derive = async <T>(mnemonic: string): Promise<Response<T>> => {
  return await invoke("derive", { mnemonic });
};

const importKey = async <T>(privateKey: string): Promise<Response<T>> => {
  return await invoke("import", { privateKey });
};

export { generate, derive, importKey };
