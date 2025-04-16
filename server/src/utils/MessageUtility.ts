import {httpStatus} from "../constants/httpStatus";
import {descriptionToKeyObj} from "../constants/keyDescriptionObj";

interface ErrorOptions {
  status: number;
  error: string;
  message: string;
}

class Message extends Error {
  status: number;
  error: string;

  constructor(errOptions: ErrorOptions) {
    super(errOptions.message);

    this.status = errOptions.status;
    this.error = errOptions.error;
    this.message = errOptions.message;
  }

  toJSON() {
    return {
      status: this.status,
      error: this.error,
      message: this.message
    };
  }

  static INVALID_PARAM(name: string) {
    return new Message({
      error: `invalid_parameter_${descriptionToKeyObj[name]}`,
      message: `${name}을(를) 입력해주세요.`,
      status: httpStatus.BAD_REQUEST,
    });
  }

  static WRONG_PARAM(name: string) {
    return new Message({
      error: `wrong_param_${descriptionToKeyObj[name]}`,
      message: `${name}이(가) 올바르지 않습니다.`,
      status: httpStatus.BAD_REQUEST
    });
  }

  static INCLUDE_BAN_KEYWORD(name: string) {
    return new Message({
      error: `include_ban_keyword`,
      message: `${name}에 사용할 수 없는 값이 포함되어있습니다.`,
      status: httpStatus.BAD_REQUEST
    });
  }

  static NOT_EXIST(name: string) {
    return new Message({
      error: `not_exist_${descriptionToKeyObj[name]}`,
      message: `존재하지 않는 ${name} 입니다.`,
      status: httpStatus.BAD_REQUEST
    });
  }

  static CUSTOM_ERROR(message: string) {
    return new Message({
      error: `custom_error`,
      message: message,
      status: httpStatus.CUSTOM_ERROR
    });
  }

  static TOO_LARGE_SIZE_FILE(size: number) {
    return new Message({
      error: `too_large_size_file`,
      message: `${size}MB 이하 파일만 업로드 할 수 있습니다.`,
      status: httpStatus.PAYLOAD_TOO_LARGE
    });
  }

  static MAX_SALE_KEYWORD_COUNT(cnt: number) {
    return new Message({
      error: `max_sale_keyword_count`,
      message: `키워드는 최대 ${cnt}개 까지만 등록할 수 있습니다.`,
      status: httpStatus.FORBIDDEN
    });
  }

  static ALREADY_EXIST(text: string) {
    return new Message({
      error: `already_exist_${descriptionToKeyObj[text]}`,
      message: `이미 존재하는 ${text} 입니다.`,
      status: httpStatus.BAD_REQUEST
    });
  }

  static get FORBIDDEN() {
    return new Message({
      error: `forbidden`,
      message: `해당 기능을 수행할 수 있는 권한이 없습니다.`,
      status: httpStatus.FORBIDDEN
    });
  }

  static get ADMIN_FORBIDDEN() {
    return new Message({
      error: `admin_forbidden`,
      message: `해당 기능을 수행할 수 있는 권한이 없습니다.`,
      status: httpStatus.ADMIN_FORBIDDEN
    });
  }

  static get UNAUTHORIZED() {
    return new Message({
      error: `unauthorized`,
      message: `로그인 정보가 존재하지 않습니다.`,
      status: httpStatus.UNAUTHORIZED
    });
  }

  static get WRONG_ID_OR_PASSWORD() {
    return new Message({
      error: `wrong_id_or_password`,
      message: `아이디 혹은 비밀번호가 일치하지 않습니다.`,
      status: httpStatus.BAD_REQUEST
    });
  }

  static get CAN_NOT_ACTION_DEFAULT() {
    return new Message({
      error: `can_not_action_default`,
      message: `기본값은 삭제 또는 변경할 수 없습니다.`,
      status: httpStatus.BAD_REQUEST
    });
  }

  static get EXPIRED_TOKEN() {
    return new Message({
      error: `expired_token`,
      message: `토큰이 만료되었습니다.`,
      status: httpStatus.UNAUTHORIZED
    });
  }

  static get EMPTY_DAO_ARGUMENT() {
    return new Message({
      error: 'empty_dao_argument',
      message: '예상치 못한 서버 오류가 발생했습니다.',
      status: httpStatus.INTERNAL_SERVER_ERROR
    });
  }

  static get SERVER_ERROR() {
    return new Message({
      error: 'server_error',
      message: '예기치 않은 오류가 발생했습니다.\n잠시 뒤에 다시 시도해주세요.',
      status: httpStatus.INTERNAL_SERVER_ERROR
    });
  }

  static get TRANSACTION_EXIST() {
    return new Message({
      error: "transaction_exist",
      message: "트랜잭션이 이미 존재합니다.",
      status: httpStatus.INTERNAL_SERVER_ERROR
    });
  }

  static get TRANSACTION_NOT_EXIST() {
    return new Message({
      error: "transaction_not_exist",
      message: "트랜잭션이 존재 하지 않습니다.",
      status: httpStatus.INTERNAL_SERVER_ERROR
    });
  }

  static get SNS_FAIL() {
    return new Message({
      error: 'sns_fail',
      message: 'SNS 로그인에 실패하였습니다.\n잠시 뒤에 다시 시도해주세요.',
      status: httpStatus.INTERNAL_SERVER_ERROR
    });
  }
}

export {Message};
