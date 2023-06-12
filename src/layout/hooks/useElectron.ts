/*
 * @Author: Libra
 * @Date: 2023-06-12 14:20:32
 * @LastEditors: Libra
 * @Description: check is electron environment
 */
export const useElectron = () => {
  function isElectron() {
    // import.meta.env.VITE_ELECTRON is string, I don't know why
    return String(import.meta.env.VITE_ELECTRON) === "true";
  }

  return {
    isElectron
  };
};
