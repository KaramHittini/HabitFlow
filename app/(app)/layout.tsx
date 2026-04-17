import { BottomNav } from '@/components/ui/BottomNav'
import { Sidebar } from '@/components/ui/Sidebar'
import { ToastContainer } from '@/components/ui/ToastContainer'
import { CelebrationOverlay } from '@/components/ui/CelebrationOverlay'
import { PageTransition } from '@/components/PageTransition'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh" style={{ background: 'var(--bg-base)' }}>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <PageTransition>
          <main className="flex-1 pb-20 md:pb-6">{children}</main>
        </PageTransition>
        <BottomNav />
      </div>
      <ToastContainer />
      <CelebrationOverlay />
    </div>
  )
}
