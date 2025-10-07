import { addRulesforSlot } from "@/services/TurfOwner/turfOwnerService"
import type { IGenerateRulesResponse } from "@/types/Response"
import type { IRules } from "@/types/rules_type"

import { useMutation } from "@tanstack/react-query"

export const useAddRulesMutation = ()=>{
    return useMutation<IGenerateRulesResponse,Error,IRules>({
        mutationFn:addRulesforSlot
    })
}

