"use client";

import { useState } from "react";
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
    AlertDialog,
    AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { setCustomUserClaims } from "@/actions/auth";
import useAlert from "@/hooks/useAlert";
import useAuthStore from "@/contexts/useAuth";

export default function SetClaims() {

    const {refreshUser} = useAuthStore()
    const [accType, setAcctype] = useState('');
    const [updating, setUpdating] = useState(false);
    const [open, setOpen] = useState(true); // Always start open
    const { setAlert } = useAlert();

    const handleSetClaim = async () => {
        if (accType === 'renter' || accType === 'agent') {
            setUpdating(true);
            const res = await setCustomUserClaims({ accountType: accType });
            if (!res.success) {
                setAlert(res.message, 'error');
            } else {
                await refreshUser()
                setAlert(`Account set to ${accType}`, 'success');
                setOpen(false);
            }
            setUpdating(false);
        }
    };

    return (
        <AlertDialog open={open}>
            <AlertDialogContent className="w-full flex flex-col justify-between items-start gap-8">
                <h2 className="text-sm">Which account are you creating?</h2>

                <ToggleGroup type="single" variant="outline" onValueChange={setAcctype} className="grid w-full grid-cols-2 gap-2">
                    <ToggleGroupItem value="renter" aria-label="Toggle bold">
                        Renter
                    </ToggleGroupItem>
                    <ToggleGroupItem value="agent" aria-label="Toggle italic">
                        Agent
                    </ToggleGroupItem>
                </ToggleGroup>

                <Button loading={updating} className="w-full" onClick={handleSetClaim}>
                    Continue {accType && <>as <span className="uppercase pl-2">{accType}</span></>}
                </Button>
            </AlertDialogContent>
        </AlertDialog>
    );
}
