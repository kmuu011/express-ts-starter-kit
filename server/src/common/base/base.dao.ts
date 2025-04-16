import {ObjectUtility} from "../../utils/ObjectUtility";
import {Message} from "../../utils/MessageUtility";

export abstract class BaseDao {
  protected validateArguments(argument: AnyObject) {
    const object = ObjectUtility.removeNullOrUndefinedOfObject(argument[0]);

    if(Object.keys(object).length) return;

    console.log("DAO Select시 Argument가 잘못되었습니다.");

    throw Message.EMPTY_DAO_ARGUMENT;
  }
}