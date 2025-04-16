import {NextFunction, Request, Response} from "express";
import {Database} from "../utils/Database";
import {DI_TYPES} from "../common/inversify/DI_TYPES";
import {container} from "../common/inversify/container";
import {injectable} from "inversify";

const releaseConnection = async (
  db: Database,
) => {
  if (!db.isReleased && db?.hasConnection()) {
    db.isReleased = true;
    await db.release();
  }
}

@injectable()
export class DbMiddleware {
  constructor() {
  }

  public attachDb = () => async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    /**
     * 서로 다른 요청 컨텍스트끼리 DB인스턴스가 공유되지 않아
     * 하나의 요청에서 DB 인스턴스를 공유하려면 req에 태워야하므로
     * 이와 같이 설계함.
     * */
    req.db = container.get<Database>(DI_TYPES.Database);

    res.on('finish', async () => {
      await releaseConnection(
        req.db!
      );
    });

    res.on('close', async () => {
      await releaseConnection(
        req.db!
      );
    });

    req.on('aborted', async () => {
      await releaseConnection(
        req.db!
      );
    });

    next();
  }
}