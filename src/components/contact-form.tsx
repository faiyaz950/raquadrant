"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import { handleContactForm, type FormState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Loader2 } from "lucide-react";

const initialState: FormState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto font-bold" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          Submit Inquiry <ArrowRight className="ml-2 h-5 w-5" />
        </>
      )}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useFormState(handleContactForm, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        // Errors are displayed below fields, no toast needed for validation errors.
      } else {
        toast({
          title: "Success",
          description: state.message,
        });
        formRef.current?.reset();
      }
    }
  }, [state, toast]);
  
  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" placeholder="John Doe" required defaultValue={state.fields?.name} />
        {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required defaultValue={state.fields?.email} />
          {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+91 123-456-7890" defaultValue={state.fields?.phone} />
           {state.errors?.phone && <p className="text-sm text-destructive">{state.errors.phone[0]}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" placeholder="Inquiry about Rooftop Solar" required defaultValue={state.fields?.subject} />
        {state.errors?.subject && <p className="text-sm text-destructive">{state.errors.subject[0]}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" placeholder="I'm interested in learning more about your solar solutions..." className="min-h-[120px]" required defaultValue={state.fields?.message} />
        {state.errors?.message && <p className="text-sm text-destructive">{state.errors.message[0]}</p>}
      </div>
      <div>
        <SubmitButton />
      </div>
       {state.errors && <p className="text-sm text-destructive mt-4">{state.message}</p>}
    </form>
  );
}
