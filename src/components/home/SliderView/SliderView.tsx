import LazyImage from "../../Image/LazyImage"

interface SliderViewProps {
    navigatePost: (path: string) => void;
    or: any; // You should replace 'any' with a more specific type based on what 'or' represents
    class_name: { grid: string; item: string } | undefined;
    key: number;
  }
  
  const SliderView: React.FC<SliderViewProps> = ({ navigatePost, or, class_name, key }) => {
  // Use the props in your component's return statement as needed
  return (
    <>
    <div className={class_name?.item}>
      <LazyImage 
        id={'orma_feed' + or.key} // Assuming 'or.key' exists and is unique
        src={or.Post?.image_url}
        placeholder={or.Post?.compressed_url}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        className="grid_image"
      />
    </div></>
  );
};


export default SliderView;