export const createDivAndAppendToBody = (id: string) => {
  const div = document.createElement('div')
  div.id = id
  document.body.append(div)
  return div
}
