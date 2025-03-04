import { ChildrenProps } from '../../../../types/common';
import Breadcrumb from '../../../Breadcrumbs/Breadcrumb';

interface PageContainerProps extends ChildrenProps {
  title: string;
}

const PageContainer = ({ children, title }: PageContainerProps) => {
  return (
    <div className="grid grid-cols-1 gap-9 ">
      <div className="flex flex-col gap-9">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-auto">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            {/* <h3 className="font-medium text-black dark:text-white">{title}</h3> */}
            <Breadcrumb pageName={title} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageContainer;
