import { fetchAssetsPoolData } from "contract/ContractMethods";
import { updatePoolData } from "redux/actions/user.actions";

export const refreshPoolData = async (address, dispatch) => {
  try {
    const res = await fetchAssetsPoolData(address);
    if (!!res && typeof res !== "undefined") {
      dispatch(updatePoolData(res));
    }
  } catch (error) {}
};

export function commaFy(num) {
  var str = num.toString().split(".");
  if (str[0].length >= 4) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
  }
  return str.join(".");
}
