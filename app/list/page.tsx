'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

type RecordItem = {
  id: string
  date: string
  store_name: string
  machine_name: string
  investment: number
  recovery: number
  memo: string
}

export default function ListPage() {
  const supabase = createClient()
  const [records, setRecords] = useState<RecordItem[]>([])
  const [loading, setLoading] = useState(true)

  // 画面を開いたときにSupabaseからデータを取得する
  useEffect(() => {
    const fetchRecords = async () => {
      const { data, error } = await supabase
        .from('records')
        .select('*')
        .order('date', { ascending: false }) // 新しい日付順に並び替え

      if (error) {
        console.error('データ取得エラー:', error.message)
      } else {
        setRecords(data || [])
      }
      setLoading(false)
    }

    fetchRecords()
  }, [supabase])

  // 全体の合計を計算
  const totalInvestment = records.reduce((acc, cur) => acc + cur.investment, 0)
  const totalRecovery = records.reduce((acc, cur) => acc + cur.recovery, 0)
  const totalBalance = totalRecovery - totalInvestment

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">パチスロ収支 一覧</h1>
        <Link
          href="/add"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200"
        >
          + 収支を登録する
        </Link>
      </div>

      {/* サマリーカード（総投資・総回収・収支差額） */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-sm text-gray-500">総投資</p>
          <p className="text-xl font-bold text-gray-800">¥{totalInvestment.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-sm text-gray-500">総回収</p>
          <p className="text-xl font-bold text-gray-800">¥{totalRecovery.toLocaleString()}</p>
        </div>
        <div className={`p-4 rounded-lg border text-center ${totalBalance >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className="text-sm text-gray-500">トータル収支</p>
          <p className={`text-xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalBalance >= 0 ? `+¥${totalBalance.toLocaleString()}` : `-¥{Math.abs(totalBalance).toLocaleString()}` }
          </p>
        </div>
      </div>

      {/* 一覧テーブル */}
      {loading ? (
        <p className="text-center text-gray-500 py-10">読み込み中...</p>
      ) : records.length === 0 ? (
        <p className="text-center text-gray-500 py-10">まだ収支データが登録されていません。</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-600 text-sm">
                <th className="py-3 px-4">日付</th>
                <th className="py-3 px-4">店舗名</th>
                <th className="py-3 px-4">機種名</th>
                <th className="py-3 px-4 text-right">投資 / 回収</th>
                <th className="py-3 px-4 text-right">収支</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-800">
              {records.map((record) => {
                const balance = record.recovery - record.investment
                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{record.date}</td>
                    <td className="py-3 px-4">{record.store_name}</td>
                    <td className="py-3 px-4 font-medium">{record.machine_name}</td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      ¥{record.investment.toLocaleString()} / ¥{record.recovery.toLocaleString()}
                    </td>
                    <td className={`py-3 px-4 text-right font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {balance >= 0 ? `+¥${balance.toLocaleString()}` : `-¥{Math.abs(balance).toLocaleString()}`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}