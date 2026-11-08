'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function AddRecordPage() {
  const supabase = createClient()
  
  // フォームの入力値を管理する状態
  const [date, setDate] = useState('')
  const [storeName, setStoreName] = useState('')
  const [machineName, setMachineName] = useState('')
  const [investment, setInvestment] = useState('')
  const [recovery, setRecovery] = useState('')
  const [memo, setMemo] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // フォーム送信時の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // ログイン中のユーザー情報を取得
    const { data: { user } } = await supabase.auth.getUser()

    // Supabaseの records テーブルにデータを挿入
    const { error } = await supabase.from('records').insert([
      {
        user_id: user?.id || null,
        date,
        store_name: storeName,
        machine_name: machineName,
        investment: Number(investment),
        recovery: Number(recovery),
        memo,
      },
    ])

    setLoading(false)

    if (error) {
      setMessage('エラーが発生しました: ' + error.message)
    } else {
      setMessage('収支データを正常に登録しました！')
      // フォームをリセット
      setDate('')
      setStoreName('')
      setMachineName('')
      setInvestment('')
      setRecovery('')
      setMemo('')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">パチスロ収支 登録</h1>
      
      {message && (
        <div className={`mb-4 p-3 rounded text-sm ${message.includes('エラー') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">稼働日</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">店舗名</label>
          <input
            type="text"
            placeholder="例: 新橋UNO"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">機種名</label>
          <input
            type="text"
            placeholder="例: スマスロ北斗の拳"
            value={machineName}
            onChange={(e) => setMachineName(e.target.value)}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">投資額（円）</label>
            <input
              type="number"
              placeholder="20000"
              value={investment}
              onChange={(e) => setInvestment(e.target.value)}
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">回収額（円）</label>
            <input
              type="number"
              placeholder="45000"
              value={recovery}
              onChange={(e) => setRecovery(e.target.value)}
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">メモ（設定推測など）</label>
          <textarea
            placeholder="例: 高設定示唆強が出たけど投資がかさんだ"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={3}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200 disabled:bg-gray-400"
        >
          {loading ? '保存中...' : '収支を登録する'}
        </button>
      </form>
    </div>
  )
}