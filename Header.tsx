import React from "react";
import { useNavigate } from "react-router-dom";

interface DropdownMenuProps {
  items: { label: string; onClick: () => void; testId?: string }[];
  buttonLabel: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, buttonLabel }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative inline-block text-left">
      <button
        className="btn-primary w-full"
        onClick={() => setOpen(!open)}
        data-testid={`dropdown-button-${buttonLabel}`}
        aria-haspopup="true"
        aria-expanded={!!open}
      >
        {buttonLabel}
      </button>
      {open && (
        <div
          role="menu"
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-surface-800 border border-accent-teal z-10"
        >
          <div className="py-1">
            {items.map((item) => (
              <button
                role="menuitem"
                key={item.label}
                onClick={item.onClick}
                className="block w-full text-left px-4 py-2 text-sm text-text-light hover:bg-accent-teal hover:text-background-dark rounded"
                data-testid={
                  item.testId ? item.testId : `dropdown-item-${item.label}`
                }
                {...(item.workshopId ? { "data-workshop-testid": item.workshopId } : {})}
                tabIndex={0}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    navigate("/login");
  };

  const allDropdownItems = [
    {
      label: "Profile",
      onClick: () => navigate("/profile"),
      testId: "dropdown-item-profile",
    },
    {
      label: "Settings",
      onClick: () => navigate("/settings"),
      testId: "dropdown-item-settings",
    },
    {
      label: "Help",
      onClick: () => navigate("/help"),
      testId: "dropdown-item-help",
    },
    { label: "Logout", onClick: handleLogout, testId: "dropdown-item-logout" },
  ];

  return (
    <header
      className="flex items-center justify-between px-6 py-4 bg-surface-800 shadow-md border-b border-accent-teal"
      data-testid="header"
    >
      <div className="flex items-center space-x-4">
        <h1
          className="text-2xl font-extrabold text-accent-teal drop-shadow-lg"
          data-testid="app-title"
        >
          Wonky Sprout OS
        </h1>
        <nav className="flex space-x-2" aria-label="Main navigation">
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-primary"
            data-testid="nav-dashboard"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/cockpit")}
            className="btn-primary"
            data-testid="nav-workshop"
            data-workshop-testid="nav-workshop"
          >
            The Workshop
          </button>
          <button
            onClick={() => navigate("/agenda")}
            className="btn-primary"
            data-testid="nav-agenda"
          >
            Today's Agenda
          </button>
          <button
            onClick={() => navigate("/checklists")}
            className="btn-primary"
            data-testid="nav-checklists"
          >
            Checklists
          </button>
          <button
            onClick={() => navigate("/sop-vault")}
            className="btn-primary"
            data-testid="nav-sop-vault"
          >
            SOP Vault
          </button>
          <button
            onClick={() => navigate("/child-dashboard")}
            className="btn-primary"
            data-testid="nav-child-dashboard"
          >
            Child Dashboard
          </button>
          <div data-testid="nav-system" data-workshop-testid="nav-system">
            <DropdownMenu
              buttonLabel="System"
              items={[
                {
                  label: "The Workshop",
                  onClick: () => navigate("/cockpit"),
                  testId: "nav-system-cockpit",
                  // keep a workshop id for the item to help E2E stability
                  workshopId: "nav-system-cockpit",
                },
                {
                  label: "Weekly Review",
                  onClick: () => navigate("/weekly-review"),
                  testId: "nav-system-weekly-review",
                  workshopId: "nav-system-weekly-review",
                },
                {
                  label: "SOP Vault",
                  onClick: () => navigate("/sop-vault"),
                  testId: "nav-system-sop-vault",
                  workshopId: "nav-system-sop-vault",
                },
              ]}
            />
          </div>
        </nav>
      </div>
      <DropdownMenu items={allDropdownItems} buttonLabel="Menu" />
    </header>
  );
};

export default Header;
