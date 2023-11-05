'use client'
import React, { useState, useEffect } from 'react';
import LoadingModal from "@/components/loadingModal/LoadingModal";

const TransactionsModal = (props) => {
  console.log(props);
  const { chainName, txHash } = props;
  const [list, setList] = useState({})
  const key = '00aa01cefaf84f8fcd088395142c108a2c4aadbc'
  const [searchValue, setSearchValue] = useState('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
  const [loading, setLading] = useState(true)

// coins tokens
  const TransactionDetails = async (chain_name: any, tx_hash: any) => {
    try {
      const response = await fetch('https://datalayer.decommas.net/datalayer/api/v1/transaction/' + chainName + '/' + txHash + '?api-key=' + key);
      const res = await response.json();
      let timestamp = new Date(res.result.block_timestamp);
      timestamp.setDate(timestamp.getDate() - 1);  // 调整到前一天
      res.result.block_timestamp = timestamp.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

      res.result.value = formatNumber(Number(res.result.value))
      setList(res.result)
      setLading(false)
      console.log(res.result)
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    TransactionDetails();
  }, []);

// 格式化数字
  const formatNumber = (number: number): string  => {
    return number.toLocaleString('en-US', { useGrouping: true, minimumFractionDigits: 0 });
  }

  return (
      <main>
        {loading ? <LoadingModal></LoadingModal> : ''}
        <div className="fixed z-40 bg-black bg-opacity-70 left-0 top-0 right-0 bottom-0 flex justify-center items-center"
             onClick={() => props.onClose()}>
          <div className="bg-white rounded px-6 py-6 w-1/2 min-w-fit"
               onClick={(e) => e.stopPropagation()}>
            <h2 className="text-base font-semibold leading-6 text-gray-900">Transactions Detail</h2>
            <div className="mt-4 border-t border-gray-900/5 pt-2 sm:pr-4 text-sm">
              <div className="font-semibold text-gray-900">From</div>
              <div className="mt-2 text-gray-500">{list.from_address}</div>
            </div>
            <div className="mt-4 border-t border-gray-900/5 pt-2 sm:pr-4 text-sm">
              <div className="font-semibold text-gray-900">To</div>
              <div className="mt-2 text-gray-500">{list.to_address}</div>
            </div>
            <div className="mt-4 sm:border-t sm:border-gray-900/5 pt-2 text-sm">
              <div className="font-semibold text-gray-900">Transaction Hash:</div>
              <div className="mt-2 text-gray-500">{list.hash}</div>
            </div>
            <table className="mt-16 w-full whitespace-nowrap text-left text-sm leading-6">
              <colgroup>
                <col className="w-full" />
              </colgroup>
              <tbody>
              <tr className="border-b border-gray-100">
                <td className="max-w-0 px-0 py-5 align-top">
                  <div className="truncate text-gray-500">Time:</div>
                </td>
                <td className="py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700">{list.block_timestamp}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="max-w-0 px-0 py-5 align-top">
                  <div className="truncate text-gray-500">Block Number :</div>
                </td>
                <td className="py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700">{list.block_number}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="max-w-0 px-0 py-5 align-top">
                  <div className="truncate text-gray-500">Value :</div>
                </td>
                <td className="py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700">{list.value}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="max-w-0 px-0 py-5 align-top">
                  <div className="truncate text-gray-500">Gas Price :
                  </div>
                </td>
                <td className="py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700">{list.gas_price}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="max-w-0 px-0 py-5 align-top">
                  <div className="truncate text-gray-500">Gas Used :
                  </div>
                </td>
                <td className="py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700">{list.gas_used}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
  )
}

export default TransactionsModal;