import { JSX } from "react";

import HeroIcon from "@/public/heroIcon.svg";

import { ROUTES } from "@/constants/routes.constant";

import Icon from "@/components/Icon";
import { ModeToggle } from "@/components/ModeToggle";
import { Avatar } from "@/components/Avatar";
import { Breadcrumbs } from "@/components/Breadcrumbs";

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps): JSX.Element => {
  return (
    <header className={className}>
      <div className="rounded-2xl border border-[#222121] px-2 py-2  w-4xl flex items-center justify-between">
        <div className="flex justify-center items-center gap-2">
          <Icon href={ROUTES.home} src={HeroIcon} alt="Hero icon" />
          <Breadcrumbs />
        </div>
        {/* <Tools /> */}
        <div className="flex">
          <ModeToggle />
          <Avatar />
        </div>
      </div>
      <div className="rounded-2xl border border-[#222121] px-2 py-2">
        <button>Recent</button>
        <button>Whitelist</button>
        {/* <RecentFiles />
        <Whitelist /> */}
      </div>
    </header>
  );
};
