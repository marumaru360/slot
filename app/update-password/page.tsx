'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function UpdatePasswordPage() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSessionReady, setIsSessionReady] = useState(false)

  // ページ読み込み時にURLのcodeをセッションに交換する
  useEffect(() => {
    const handleCodeExchange = async () => {
      const code = searchParams.get('code')
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          setMessage('エラー: 認証リンクが無効か、すでに使用されています。')
        } else {
          setIsSessionReady(true) // セッション確立成功！
        }
      } else {
        // すでにセッションがある場合のフォールバック
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          setIsSessionReady(true)
        } else {
          setMessage('エラー: セッションが見つかりません。再度パスワードリセットを行ってください。')
        }
      }
    }

    handleCodeExchange()
  }, [searchParams, supabase])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // 確立されたセッションに対してパスワードを更新
    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    setLoading(false)

    if (error) {
      setMessage('エラーが発生しました: ' + error.message)
    } else {
      setMessage('パスワードを正常に更新しました！まもなくトップページに移動します...')
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">新しいパスワードの設定</h1>
      
      {message && (
        <div className={`mb-4 p-3 rounded text-sm ${message.includes('エラー') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {isSessionReady ? (
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">新しいパスワード</label>
            <input
              type="password"
              placeholder="6文字以上で入力"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-200 disabled:bg-gray-400"
          >
            {loading ? '更新中...' : 'パスワードを更新する'}
          </button>
        </form>
      ) : (
        <p className="text-center text-gray-600 py-4">セッションを確認中...</p>
      )}
    </div>
  )
}