import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import "../src/modules/index";
import { getModuleRoutes } from "../src/module_registry";

describe("Module Routes Integration", () => {
  it("renders module route component for template-sample", async () => {
    const routes = getModuleRoutes();
    const sampleRoute = routes.find((r) => r.path === "/template-sample");
    expect(sampleRoute).toBeTruthy();
    // Render the route using a MemoryRouter
    render(
      <MemoryRouter initialEntries={[sampleRoute!.path]}>
        <Routes>
          {routes.map((r) => {
            const Cmp = r.component as React.ComponentType<any>;
            return <Route key={r.id} path={r.path} element={<Cmp />} />;
          })}
        </Routes>
      </MemoryRouter>,
    );
    // Assert presence of a string from the template sample
    expect(
      await screen.findByText(/Template Sample Module/i),
    ).toBeInTheDocument();
  });
});
