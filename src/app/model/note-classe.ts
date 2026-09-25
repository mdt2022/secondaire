export interface NoteClassePayload {
  ecoleId: number;
  classeId: number;
  anneeId: number;
  periodeId: number;
  matiereId: number;
  notes: NoteEleve[];
}

export interface NoteEleve {
  eleveId: number;
  noteClasse?: number;
  noteCompo?: number;
}
