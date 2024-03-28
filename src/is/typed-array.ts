import { nodeTypes } from '../global/node-types.ts';
import { getTag } from '../object/get-tag.ts';
import { isNil } from './nil.ts';
import { isObjectLike } from './object-like.ts';

const reTypedTag =
  /^\[object (?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)Array]$/;

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
const nodeIsTypedArray = nodeTypes?.isTypedArray as (value: unknown) => boolean;

const isTypedArray = isNil(nodeIsTypedArray)
  ? (value: unknown) => {
      return isObjectLike(value) && reTypedTag.test(getTag(value));
    }
  : (value: unknown) => {
      return nodeIsTypedArray(value);
    };
