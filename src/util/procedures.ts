import { mapProcedureState, Procedure } from "@/display/procedure";

export function mapAll<V, S, R>(mapper: (state: R) => S, procedures: Array<Procedure<any, S>>): Array<Procedure<V, R>> {
  return procedures.map(procedure => mapProcedureState(mapper, procedure))
}
