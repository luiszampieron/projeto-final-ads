declare module 'next/*' {
  const whatever: any
  export default whatever
}

declare module 'next' {
  const whatever: any
  export default whatever
  export type Metadata = any
  export type NextConfig = any
}
