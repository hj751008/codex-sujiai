import { gradeOptions } from "@/features/auth/model";
import { Card, Body, Bullet, H1, NavButton, Screen } from "@/ui/primitives";

export default function AuthScreen() {
  return (
    <Screen>
      <Card>
        <H1>부모 계정과 수지 PIN</H1>
        <Body>
          1차 버전은 부모가 계정을 만들고, 수지는 부모가 만든 프로필의 PIN으로
          들어오는 구조다.
        </Body>
      </Card>

      <Card>
        <H1>지원 학년</H1>
        {gradeOptions.map((option) => (
          <Bullet key={option.value}>{option.label}</Bullet>
        ))}
      </Card>

      <NavButton href="/" label="홈으로 돌아가기" />
    </Screen>
  );
}
