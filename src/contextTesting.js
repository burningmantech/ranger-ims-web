import { render } from "@testing-library/react";

import { IMSContext } from "./ims/context";


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
