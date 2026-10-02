/**
 * Russian typesetting: glue one- and two-letter words (в, и, на…) to the next
 * word, dashes to the previous one, and numbers to what follows them (digit
 * groups, "2 суток", "100 000 сум"), so lines never
 * end on a dangling preposition or start with a dash.
 */
export function typograph(text: string) {
  return text
    .replace(/(?<=^|[\s ])([а-яё]{1,2})\s/giu, "$1 ")
    .replace(/\s—/g, " —")
    .replace(/(\d)\s(?=[\dа-яё])/giu, "$1 ");
}
