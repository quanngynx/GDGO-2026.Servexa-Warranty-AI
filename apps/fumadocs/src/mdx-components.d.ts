import { getMDXComponents } from './mdx-components'

// declare module 'mdx/types.js' {
//   // Augment the MDX types to make it understand React.
//   // biome-ignore lint/style/noNamespace: required for MDX
//   namespace JSX {
//     type Element = React.JSX.Element
//     type ElementClass = React.JSX.ElementClass
//     type ElementType = React.JSX.ElementType
//     type IntrinsicElements = React.JSX.IntrinsicElements
//   }
// }

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
