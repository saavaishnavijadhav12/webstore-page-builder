import { CustomImage } from "../../common/image";
import { NavLink } from "../../common/nav-link";

interface ICategoryProps {
  seoUrl: string;
  name: string;
  imgSrc: string;
  categoryId: number;
}

export function Category(props: Readonly<ICategoryProps>) {
  return (
    <NavLink url={props.seoUrl || `/category/${props.categoryId}`} title={props.name} dataTestSelector={`link${props.categoryId}`}>
      <div className="col-span-1 max-w-[9.4rem] min-w-[9.4rem] sm:w-full px-0 mx-0 pl-1 min-h-[3.125rem] " data-test-selector={`divCategory${props.categoryId}`}>
        <div className="relative h-full overflow-hidden rounded-md">
          <CustomImage src={props.imgSrc} alt="It's a Category Photograph" dataTestSelector={`imgCategory${props.categoryId}`} />
        </div>
        <p className="px-1 py-2 text-sm font-semibold text-center uppercase" data-test-selector={`txtCategoryName${props.categoryId}`}>
          {props.name}
        </p>
      </div>
    </NavLink>
  );
}
