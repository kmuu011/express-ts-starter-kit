// infra/Transactional.ts
import { DBContext } from './DBContext';

export function Transactional() {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const db = DBContext.get();
      await db.startTransaction();

      try {
        const result = await original.apply(this, args);
        await db.commit();
        return result;
      } catch (err) {
        await db.rollback();
        throw err;
      }
    };

    return descriptor;
  };
}
