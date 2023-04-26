import { createLoader, EngineConfigMetadata } from "@modularcloud/ecs";
import { createModularCloud } from "@modularcloud/sdk";
import { z } from "zod";
import {
  JSONRPCResponse,
  Transaction,
  TxSearch,
} from "../../../lib/service-manager";
import { PaginationTransform } from "./pagination";

export async function PaginationExtract(
  _q: unknown,
  metadata: EngineConfigMetadata
) {
  const query = z.string().parse(_q);
  const [value, collection, page = "1"] = query.split(":");
  if (collection === "transactions") {
    let sendResponse, receiveResponse;
    if (value.match(/^dym\w{39}$/)) {
      sendResponse = await fetch(
        `https://rpc-hub-35c.dymension.xyz/tx_search?query="message.sender = '${value}'"&prove=false&page=${page}&per_page=15`
      );
      receiveResponse = await fetch(
        `https://rpc-hub-35c.dymension.xyz/tx_search?query="transfer.recipient = '${value}'"&prove=false&page=${page}&per_page=15`
      );
    } else if (value.match(/^rol\w{39}$/)) {
      sendResponse = await fetch(
        `https://rpc-rollappx-35c.dymension.xyz/tx_search?query=message.sender='${value}'&prove=false&page=${page}&per_page=15&order_by=asc`
      );
      receiveResponse = await fetch(
        `https://rpc-rollappx-35c.dymension.xyz/tx_search?query=transfer.recipient='${value}'&prove=false&page=${page}&per_page=15&order_by=asc`
      );
    } else {
      throw new Error("Unsupported address");
    }
    const emptyResponse = {
      jsonrpc: "2.0",
      id: 1,
      result: {
        total_count: "0",
        txs: [] as Transaction[],
      },
    };
    let sendTxs: JSONRPCResponse<TxSearch> = emptyResponse;
    let receiveTxs: JSONRPCResponse<TxSearch> = emptyResponse;
    if(sendResponse.ok) {
      sendTxs = (await sendResponse.json()) as JSONRPCResponse<TxSearch>;
    }
    if(receiveResponse.ok) {
      receiveTxs = (await receiveResponse.json()) as JSONRPCResponse<TxSearch>;
    }
    return {
      value,
      transactions: {
        sendTxs,
        receiveTxs,
      },
      page,
    };
  }
}

export const PaginationLoader = createLoader()
  .addExtract(PaginationExtract)
  .addTransform(PaginationTransform)
  .finish();
