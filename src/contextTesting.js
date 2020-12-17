import { render } from "@testing-library/react";

import { IMSContext } from "./context";


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
