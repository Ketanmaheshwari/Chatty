
import {joiRequestValidationError} from '@global/helpers/error-handler';
import {Request,Response,NextFunction} from 'express';
import {ObjectSchema} from 'joi';

type IJoiDecorator = (traget: any,key:string,descriptor:PropertyDescriptor)=>void;

export const joiValidation = (schema:ObjectSchema):IJoiDecorator => {
  return (_target: any,key:string,descriptor:PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args:any[]) {
      const req: Request = args[0];
      // const res: Response = args[1];
      // const next: NextFunction = args[2];

      //validate
      const {error} =await Promise.resolve(schema.validate(req.body));

      if (error?.details) {
        throw new joiRequestValidationError(error.details[0].message);
      }
      return originalMethod.apply(this,args);
    };
    return descriptor;
  };
};
