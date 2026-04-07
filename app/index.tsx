import { createInitialAppShellState } from "@/lib/domain/app-shell";
import { referencePolicy } from "@/features/reference-ingest/model";
import { Card, Body, Bullet, H1, NavButton, Screen } from "@/ui/primitives";

export default function HomeScreen() {
  const shell = createInitialAppShellState();

  return (
    <Screen>
      <Card>
        <Body>{shell.appName}</Body>
        <H1>수지의 첫 생각을 다시 세우는 AI 학습 앱</H1>
        <Body>
          실AI 튜터, 부모 리포트, 참고자료 전용 파이프라인을 분리해서
          구조가 엉키지 않게 시작한다.
        </Body>
      </Card>

      <Card>
        <H1>역할 진입</H1>
        <NavButton href="/auth" label="부모와 수지 진입하기" />
        <NavButton href="/learner" label="수지 학습 데모 보기" />
        <NavButton href="/parent" label="부모 리포트 데모 보기" />
      </Card>

      <Card>
        <H1>참고자료 원칙</H1>
        {referencePolicy.map((item) => (
          <Bullet key={item}>{item}</Bullet>
        ))}
      </Card>
    </Screen>
  );
}
