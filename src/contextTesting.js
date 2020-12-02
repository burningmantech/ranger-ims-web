import { render } from "@testing-library/react";

import { AuthenticatorContext, IMSContext } from "./context";


export const renderWithAuthenticator = (
  content, authenticator, ...renderOptions
) => {
  return render(
    (
      <AuthenticatorContext.Provider value={{authenticator: authenticator}}>
        {content}
      </AuthenticatorContext.Provider>
    ),
    ...renderOptions
  );
}


export const renderWithIMS = (content, ims, ...renderOptions) => {
  return render(
    (
      <IMSContext.Provider value={{ims: ims}}>
        {content}
      </IMSContext.Provider>
    ),
    ...renderOptions
  );
}
