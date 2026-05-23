const fs = require('fs');
const filePath = 'components/forms/school/update/information-form.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  `type Props = {
  school: School;
};

export const InformationForm = ({ school }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);`,
  `type Props = {
  school: School;
  asModal?: boolean;
  defaultIsUpdating?: boolean;
};

export const InformationForm = ({ school, asModal = true, defaultIsUpdating = false }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(defaultIsUpdating);`
);

const returnIndex = content.indexOf('  return (\n    <Modal>');
if (returnIndex === -1) {
    console.error("Could not find return statement");
    process.exit(1);
}

const beforeReturn = content.substring(0, returnIndex);
const newReturn = `  const FormFields = (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tên trường học</FormLabel>
            <FormControl>
              <Input disabled={!isUpdating} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="short"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Giới thiệu ngắn</FormLabel>
            <FormControl>
              <Textarea disabled={!isUpdating} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="logo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ảnh đại diện</FormLabel>
            {logo.file ? (
              <div className="size-full justify-center items-center flex flex-col gap-2">
                <Avatar className="size-24">
                  <AvatarImage src={field.value} alt={field.name} />
                  <AvatarFallback>
                    <Image
                      src={"/logo_icon_light.png"}
                      alt="School logo"
                      fill
                      objectFit="cover"
                    />
                  </AvatarFallback>
                </Avatar>
                {field.value && (
                  <Button
                    disabled={!isUpdating}
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => {
                      field.onChange("");
                      setLogo({ file: undefined });
                    }}
                  >
                    Xóa ảnh đại diện
                  </Button>
                )}
              </div>
            ) : (
              <FormControl></FormControl>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="background"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ảnh bìa</FormLabel>
            {background.file ? (
              <div className="flex flex-col gap-4">
                <div className="h-48 w-full relative">
                  <Image
                    src={field.value}
                    alt={field.name}
                    className="rounded-md object-cover hover:scale-110 transition"
                    fill
                    quality={100}
                    priority
                  />
                </div>
                <Button
                  disabled={!isUpdating}
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => {
                    field.onChange("");
                    setBackground({ file: undefined });
                  }}
                >
                  Xóa ảnh bìa
                </Button>
              </div>
            ) : (
              <FormControl></FormControl>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Màu chủ đạo</FormLabel>
            <FormControl>
              <SchoolColorPicker
                disabled={!isUpdating}
                onSelect={field.onChange}
                defaultValue={field.value}
              />
            </FormControl>
            <FormDescription>
              *Dùng trong tùy chỉnh màu sắc chuyển tiếp trên ảnh bìa trang chủ người dùng
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quốc gia</FormLabel>
            <FormControl>
              <Select
                disabled={!isUpdating}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn quốc gia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AUSTRALIA">Australia</SelectItem>
                  <SelectItem value="CANADA">Canada</SelectItem>
                  <SelectItem value="KOREA">Korea</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="isPublished"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chế độ</FormLabel>
            <Select
              disabled={!isUpdating}
              onValueChange={(value) => {
                if (value === "true") {
                  field.onChange(true);
                }
                if (value === "false") {
                  field.onChange(false);
                }
              }}
              defaultValue={field.value.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chế độ hiển thị" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={"true"}>Hiển thị</SelectItem>
                <SelectItem value={"false"}>Tạm ẩn</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  if (!asModal) {
    return (
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full p-2">
          <h4 className="text-lg md:text-2xl text-main dark:text-main-foreground font-bold text-center mb-8">
            Thông tin trường học
          </h4>
          {FormFields}
          <div className="flex flex-col items-center justify-center mt-6 gap-2">
            <button
              type="submit"
              disabled={!isUpdating || loading}
              className="bg-main text-white dark:bg-main-component dark:text-main-foreground text-sm px-4 py-2 rounded-md border border-main dark:border-main-foreground disabled:opacity-50 disabled:cursor-not-allowed min-w-[112px]"
            >
              Cập nhật
            </button>
            <span className="text-center italic text-main text-xs dark:text-main-foreground">
              Vui lòng{" "}
              <a onClick={() => setIsUpdating((value) => !value)}>
                <strong className="underline cursor-pointer text-red-500">
                  nhấn vào đây
                </strong>
              </a>{" "}
              để {isUpdating ? "tắt" : "bật"} chế độ chỉnh sửa
            </span>
          </div>
        </form>
      </Form>
    );
  }

  return (
    <Modal>
      <ModalTrigger>
        <div className="shadow-[0_0_0_3px_#7d1f1f] dark:shadow-[0_0_0_3px_#ffffff] px-6 py-2 bg-transparent border border-main dark:border-main-foreground dark:text-main-foreground text-main rounded-lg font-bold transform hover:-translate-y-1 transition duration-400">
          Xem thông tin
        </div>
      </ModalTrigger>
      <ModalBody>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalContent className="max-h-[30rem] overflow-y-scroll">
              <h4 className="text-lg md:text-2xl text-main dark:text-main-foreground font-bold text-center mb-8">
                Thông tin trường học
              </h4>
              {FormFields}
            </ModalContent>
            <ModalFooter
              disabled={loading}
              confirmContent={
                <button
                  type="submit"
                  disabled={!isUpdating || loading}
                  className="bg-main text-white dark:bg-main-component dark:text-main-foreground text-sm px-2 py-1 rounded-md border border-main dark:border-main-foreground w-28 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cập nhật
                </button>
              }
              onConfirm={handleSubmit(onSubmit)}
              className="gap-1 justify-center flex-col items-center"
            >
              <span className="text-center italic text-main text-xs dark:text-main-foreground">
                Vui lòng{" "}
                <a onClick={() => setIsUpdating((value) => !value)}>
                  <strong className="underline cursor-pointer text-red-500">
                    nhấn vào đây
                  </strong>
                </a>{" "}
                để {isUpdating ? "tắt" : "bật"} chế độ chỉnh sửa
              </span>
            </ModalFooter>
          </form>
        </Form>
      </ModalBody>
    </Modal>
  );
};
`;

fs.writeFileSync(filePath, beforeReturn + newReturn);
console.log("Successfully updated information-form.tsx");
