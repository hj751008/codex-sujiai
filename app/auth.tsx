import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  createLearnerProfile,
  getCurrentParentUser,
  listParentLearners,
  signInParentAccount,
  signOutParentAccount,
  signUpParentAccount,
} from "@/features/auth/api";
import { loadCachedLearners, saveCachedLearners } from "@/features/auth/storage";
import { gradeOptions } from "@/features/auth/model";
import { hasPublicSupabaseEnv } from "@/lib/supabase/env";
import {
  ActionButton,
  Body,
  Bullet,
  Caption,
  Card,
  FieldLabel,
  H1,
  InputField,
  NavButton,
  Screen,
} from "@/ui/primitives";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [learnerName, setLearnerName] = useState("수지");
  const [learnerPin, setLearnerPin] = useState("");
  const [grade, setGrade] =
    useState<(typeof gradeOptions)[number]["value"]>("middle-1");
  const [status, setStatus] = useState("Supabase 연결 전에는 입력 규칙만 점검된다.");
  const [currentParentEmail, setCurrentParentEmail] = useState("");
  const [cachedLearners, setCachedLearners] = useState<
    Awaited<ReturnType<typeof loadCachedLearners>>
  >([]);
  const [isBusy, setIsBusy] = useState(false);

  async function refreshParentState() {
    const learners = await loadCachedLearners();
    setCachedLearners(learners);

    if (!hasPublicSupabaseEnv()) {
      setCurrentParentEmail("");
      return;
    }

    const user = await getCurrentParentUser();
    setCurrentParentEmail(user?.email ?? "");
  }

  useEffect(() => {
    refreshParentState().catch((error) => {
      setStatus(error instanceof Error ? error.message : "상태를 불러오지 못했다.");
    });
  }, []);

  async function runWithStatus(action: () => Promise<void>) {
    try {
      setIsBusy(true);
      await action();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "요청에 실패했다.");
    } finally {
      setIsBusy(false);
    }
  }

  async function syncLearners() {
    const learners = await listParentLearners();
    await saveCachedLearners(learners);
    setCachedLearners(learners);
    setStatus(`${learners.length}명의 학습자 프로필을 기기에 동기화했다.`);
  }

  return (
    <Screen>
      <Card>
        <H1>부모 계정과 수지 PIN</H1>
        <Body>
          부모는 이메일로 로그인하고 학습자를 만든다. 수지는 같은 기기에
          캐시된 학습자 프로필을 골라 PIN으로 들어오는 구조다.
        </Body>
        <Caption>
          {hasPublicSupabaseEnv()
            ? "공개 Supabase 설정 감지됨"
            : "공개 Supabase 설정이 없어 원격 호출은 비활성 상태"}
        </Caption>
      </Card>

      <Card>
        <H1>부모 계정</H1>
        <ScrollView contentContainerStyle={styles.form}>
          <FieldLabel>이메일</FieldLabel>
          <InputField
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
            placeholder="parent@example.com"
          />
          <FieldLabel>비밀번호</FieldLabel>
          <InputField
            secure
            onChangeText={setPassword}
            value={password}
            placeholder="8자 이상"
          />
          <FieldLabel>가족 이름</FieldLabel>
          <InputField
            onChangeText={setFamilyName}
            value={familyName}
            placeholder="수지가족"
          />
          <View style={styles.buttonRow}>
            <ActionButton
              label="부모 가입"
              disabled={isBusy || !hasPublicSupabaseEnv()}
              onPress={() =>
                runWithStatus(async () => {
                  const data = await signUpParentAccount(
                    email,
                    familyName,
                    password,
                  );
                  setStatus(
                    data.user
                      ? `${data.user.email ?? "부모"} 계정을 만들었다.`
                      : "가입 요청을 보냈다.",
                  );
                  await refreshParentState();
                })
              }
            />
            <ActionButton
              label="로그인"
              variant="secondary"
              disabled={isBusy || !hasPublicSupabaseEnv()}
              onPress={() =>
                runWithStatus(async () => {
                  const data = await signInParentAccount(email, password);
                  setStatus(`${data.user.email ?? "부모"} 계정으로 로그인했다.`);
                  await refreshParentState();
                })
              }
            />
          </View>
          <ActionButton
            label="로그아웃"
            variant="secondary"
            disabled={isBusy || !hasPublicSupabaseEnv()}
            onPress={() =>
              runWithStatus(async () => {
                await signOutParentAccount();
                setStatus("부모 계정에서 로그아웃했다.");
                await refreshParentState();
              })
            }
          />
        </ScrollView>
      </Card>

      <Card>
        <H1>학습자 프로필 만들기</H1>
        <Caption>
          현재 로그인: {currentParentEmail || "없음"} / 지원 학년:
          {gradeOptions.map((option) => ` ${option.label}`).join(",")}
        </Caption>
        <ScrollView contentContainerStyle={styles.form}>
          <FieldLabel>학습자 이름</FieldLabel>
          <InputField
            onChangeText={setLearnerName}
            value={learnerName}
            placeholder="수지"
          />
          <FieldLabel>학년</FieldLabel>
          <View style={styles.chipRow}>
            {gradeOptions.map((option) => (
              <ActionButton
                key={option.value}
                label={option.label}
                variant={grade === option.value ? "primary" : "secondary"}
                onPress={() => setGrade(option.value)}
              />
            ))}
          </View>
          <FieldLabel>4자리 PIN</FieldLabel>
          <InputField
            keyboardType="number-pad"
            onChangeText={setLearnerPin}
            value={learnerPin}
            placeholder="1234"
          />
          <View style={styles.buttonRow}>
            <ActionButton
              label="학습자 생성"
              disabled={isBusy || !hasPublicSupabaseEnv()}
              onPress={() =>
                runWithStatus(async () => {
                  const learner = await createLearnerProfile(
                    learnerName,
                    learnerPin,
                    grade,
                  );
                  const nextLearners = [...cachedLearners, learner];
                  await saveCachedLearners(nextLearners);
                  setCachedLearners(nextLearners);
                  setStatus(
                    `${learner.learner_name} 프로필을 만들고 기기에 캐시했다.`,
                  );
                })
              }
            />
            <ActionButton
              label="원격 학습자 동기화"
              variant="secondary"
              disabled={isBusy || !hasPublicSupabaseEnv()}
              onPress={() => runWithStatus(syncLearners)}
            />
          </View>
        </ScrollView>
      </Card>

      <Card>
        <H1>기기 캐시 학습자</H1>
        {cachedLearners.length === 0 ? (
          <Body>아직 캐시된 학습자 프로필이 없다.</Body>
        ) : (
          cachedLearners.map((learner) => (
            <Bullet key={learner.id}>
              {learner.learner_name} / {learner.grade} / PIN 힌트{" "}
              {learner.pin_hint}
            </Bullet>
          ))
        )}
      </Card>

      <Card>
        <H1>상태</H1>
        <Body>{status}</Body>
      </Card>

      <NavButton href="/" label="홈으로 돌아가기" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 10,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  chipRow: {
    gap: 8,
  },
});
