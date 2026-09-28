import { Anneeuv } from '../../model/anneeuv';

const ANNEE_BLOQUEE = '20262027';

export function estAnneeEmploiBloquee(annee?: Anneeuv | null): boolean {
  return (annee?.nom || '').replace(/\D/g, '') === ANNEE_BLOQUEE;
}