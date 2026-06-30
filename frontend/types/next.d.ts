declare module 'next/link' {
  import * as React from 'react'
  const Link: React.ComponentType<any>
  export default Link
}

declare module 'next/navigation' {
  export function redirect(url: string): never
  export function revalidatePath(path: string): void
  export function useRouter(): any
  export function useSearchParams(): any
}

declare module 'next/cache' {
  export function revalidatePath(path: string): void
}

declare module 'next/image' {
  import * as React from 'react'
  const Image: React.ComponentType<any>
  export default Image
}
