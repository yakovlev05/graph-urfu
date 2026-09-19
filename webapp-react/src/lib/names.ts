/** «Ипатов Иван Дмитриевич» → «Ипатов И. Д.» */
export function shortName(fullName: string): string {
  const [surname, ...rest] = fullName.trim().split(/\s+/)
  const initials = rest.map((part) => `${part[0]}.`).join(' ')
  return initials ? `${surname} ${initials}` : surname
}
