// @generated by protobuf-ts 2.8.0
// @generated from protobuf file "protos/sandbox.proto" (syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { Haberdasher } from "./sandbox";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { Hat } from "./sandbox";
import type { Size } from "./sandbox";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * Haberdasher service makes hats for clients.
 *
 * @generated from protobuf service Haberdasher
 */
export interface IHaberdasherClient {
    /**
     * MakeHat produces a hat of mysterious, randomly-selected color!
     *
     * @generated from protobuf rpc: MakeHat(Size) returns (Hat);
     */
    makeHat(input: Size, options?: RpcOptions): UnaryCall<Size, Hat>;
}
/**
 * Haberdasher service makes hats for clients.
 *
 * @generated from protobuf service Haberdasher
 */
export class HaberdasherClient implements IHaberdasherClient, ServiceInfo {
    typeName = Haberdasher.typeName;
    methods = Haberdasher.methods;
    options = Haberdasher.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * MakeHat produces a hat of mysterious, randomly-selected color!
     *
     * @generated from protobuf rpc: MakeHat(Size) returns (Hat);
     */
    makeHat(input: Size, options?: RpcOptions): UnaryCall<Size, Hat> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<Size, Hat>("unary", this._transport, method, opt, input);
    }
}