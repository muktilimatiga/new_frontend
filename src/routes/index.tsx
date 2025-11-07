import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  loader: (_ctx) => {
    throw redirect({
      to: '/dashboard',
    })
  },
})
