import { Checkbox, H1, Stack } from "@deskpro/deskpro-ui";
import { useDeskproAppTheme } from "@deskpro/app-sdk"

type Props = {
    title:string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    checked: boolean;
}

export const CheckboxTitle = ({
    title,
    onChange,
    checked,
}: Props) => {
    const {theme} = useDeskproAppTheme();
    return (
    <Stack vertical gap={8}>
        <div style={{ color: theme.colors.grey80 }}>
          <H1>{title}</H1>
        </div>
        <Checkbox
        checked={checked}
        onChange={onChange}
        size={14}
        />
    </Stack>)

}
