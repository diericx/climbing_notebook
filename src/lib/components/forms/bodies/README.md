Form Bodies take in a SuperForm and populate the form, but cannot stand alone as a form themselves.
They require a SuperForm wrapper at some point.

This separation is made in order to enable more complex form use cases.
More specifically, we can have forms that are completely inline, or forms that
are split up within a modal. In modals we want to put a bit more content in the form
so that the buttons can exist in a different section than the form body.
