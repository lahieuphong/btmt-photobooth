'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type PrintAutoRedirectProps = {
  href: string
  delayMs?: number
}

export default function PrintAutoRedirect({
  href,
  delayMs = 3000,
}: PrintAutoRedirectProps) {
  const router = useRouter()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.push(href)
    }, delayMs)

    return () => {
      window.clearTimeout(timer)
    }
  }, [href, delayMs, router])

  return null
}